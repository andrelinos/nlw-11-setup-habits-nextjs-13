import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '~/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const method = req.method;

    switch (method) {
        case 'POST': {
            const createHabitBody = z.object({
                title: z.string(),
                weekDays: z.array(z.number().min(0).max(6)),
            });

            const { title, weekDays } = createHabitBody.parse(req.body);

            const today = dayjs().startOf('day').toDate();

            const habit = await prisma.habit.create({
                data: {
                    title,
                    created_at: today,
                    weekDays: {
                        create: weekDays.map((weekDay) => {
                            return {
                                week_day: weekDay,
                            };
                        }),
                    },
                },
            });

            return res.status(200).json(habit);
        }
        case 'GET': {
            const habits = prisma.habit.findMany();

            return res.status(200).json(habits);
        }
        default:
            break;
    }
}
