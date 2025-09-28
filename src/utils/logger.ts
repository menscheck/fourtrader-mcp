import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.uncolorize()
    ),
    defaultMeta: { service: 'fourtrader-mcp' },
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error', 'warn', 'info', 'debug'],
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        stderrLevels: ['error', 'warn', 'info', 'debug'],
        format: winston.format.combine(
            winston.format.simple()
        )
    }));
}

export { logger };
