import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '~/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const method = req.method;

    console.log(req.query);

    switch (method) {
        case 'GET': {
            const getDayParams = z.object({
                date: z.coerce.date(),
            });

            const { date } = getDayParams.parse(req.query);

            const parsedDate = dayjs(date).startOf('day');
            const weekDay = parsedDate.get('day');

            const possibleHabits = await prisma.habit.findMany({
                where: {
                    created_at: {
                        lte: date,
                    },
                    weekDays: {
                        some: {
                            week_day: weekDay,
                        },
                    },
                },
            });

            const day = await prisma.day.findFirst({
                where: {
                    date: parsedDate.toDate(),
                },
                include: {
                    dayHabits: true,
                },
            });

            const completedHabits =
                day?.dayHabits.map((dayHabit: { habit_id: string }) => {
                    return dayHabit.habit_id;
                }) ?? [];

            return res.status(200).json({ possibleHabits, completedHabits });
        }
        default:
            return res.status(405).end();
    }
}
