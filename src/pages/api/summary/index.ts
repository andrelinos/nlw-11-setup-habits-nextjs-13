import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/lib/prisma';
import Cookies from 'js-cookie';
import { setCookie } from '~/utils/cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const method = req.method;

    switch (method) {
        case 'GET': {
            try {
                const summary = await prisma.$queryRaw`
            SELECT
              D.id,
              D.date,
              (
                SELECT
                  cast(count(*) as Decimal)
                FROM day_habits DH 
                WHERE DH.day_id = D.id
              ) as completed,
              (
                SELECT
                  cast(count(*) as Decimal)
                FROM habit_week_days HDW 
                JOIN habits H
                  ON H.id = HDW.habit_id
                WHERE
                HDW.week_day = cast(extract(day FROM D.date) as Decimal)
                AND H.created_at <= D.date
              ) as amount
            FROM days D 
          `;

                return res.status(200).json(summary);
            } catch (error: any) {
                setCookie(res, 'error-cookie', error.message, {
                    path: '/',
                    maxAge: 2592000,
                });
                res.end(res.getHeader('Set-Cookie'));
                console.log('ERRORRRRRR: ', error);
            }
        }
        default:
            return res.status(405).end();
    }
}
