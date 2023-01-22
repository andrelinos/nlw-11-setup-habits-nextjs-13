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
                  cast(count(*) as float)
                FROM day_habits DH -- DH é alias da tabela day habits
                WHERE DH.day_id = D.id
              ) as completed,
              (
                SELECT
                  cast(count(*) as float)
                FROM habit_week_days HDW -- HDW é alias da tabela habit_week_days
                JOIN habits H
                  ON H.id = HDW.habit_id
                WHERE
                  -- Esta formatação só funciona no SQLite
                  -- HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                  HDW.week_day = extract(dow FROM D.date)
      
                  -- É feita uma verificação se o hábito foi antes ou no dia da data
                  AND H.created_at <= D.date
              ) as amount
            FROM days D -- D é alias da tabela days
          `;

            return res.status(200).json(summary);
        }
        default:
            return res.status(405).end();
    }
}
