import { createLogger, format, transports } from "winston";

const customFormat = ({ message }: { message: string }) => {
  return message;
};

const printPrefix = (message: string): string => {
  return ` - ${message}`;
};

const newLogger = () => {
  const logger = createLogger({
    level: "info",
    format: format.simple(),
    transports: [new transports.File({ filename: "logs/combined.log", options: { flags: "w" } })],
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize({ message: true, colors: { error: "red", info: "white" } }),
          format.printf(customFormat),
        ),
      }),
    );
  }

  return logger;
};

const formatConnectionMessage = (
  counter: number,
  maxCounter: number,
  status: number,
  elapsed_time: number,
  url: string,
): string => {
  return `${counter}/${maxCounter} - ${status} -  ${Math.floor(elapsed_time)} ms - ${url}`;
};

const logger = newLogger();

export { newLogger, formatConnectionMessage, logger, printPrefix, customFormat };
