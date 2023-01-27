import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            const summary = await prisma.$queryRaw`
            SELECT
              D.id,
              D.date,
              (
                SELECT
                  cast(count(*) as decimal(15,2))
                FROM day_habits DH 
                WHERE DH.day_id = D.id
              ) as completed,
              (
                SELECT
                  cast(count(*) as decimal(15,2))
                FROM habit_week_days HDW 
                JOIN habits H
                  ON H.id = HDW.habit_id
                WHERE
                HDW.week_day = cast(extract(day FROM D.date) as int)      
                AND H.created_at <= D.date
              ) as amount
            FROM days D 
          `;

            return res.status(200).json(summary);
        }
        default:
            return res.status(405).end();
    }
}
