import { Request } from 'express';

export const getApiLinks = (req: Request): Array<any> => {
    return [
        {
            rel: 'self',
            href: req.protocol + '://' + req.hostname + req.path,
        },
    ];
};
