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
        case 'PATCH': {
            const toggleHabitParams = z.object({
                id: z.string().uuid(),
            });

            const { id } = toggleHabitParams.parse(req.query);
            console.log('entrou no patch: ', id);

            const today = dayjs().startOf('day').toDate();

            let day = await prisma.day.findUnique({
                where: {
                    date: today,
                },
            });

            if (!day) {
                day = await prisma.day.create({
                    data: {
                        date: today,
                    },
                });
            }

            const dayHabit = await prisma.dayHabit.findUnique({
                where: {
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id: id,
                    },
                },
            });

            if (dayHabit) {
                await prisma.dayHabit.delete({
                    where: {
                        id: dayHabit.id,
                    },
                });
            } else {
                await prisma.dayHabit.create({
                    data: {
                        day_id: day.id,
                        habit_id: id,
                    },
                });
            }

            return res.status(204).end();
        }
        default:
            return res.status(405).end();
    }
}
