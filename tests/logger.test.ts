import { formatConnectionMessage, customFormat, printPrefix } from "../src/logger";

describe("formatConnectionMessage", () => {
  test("correctly formats the output", () => {
    console.log(formatConnectionMessage(3, 123, 200, 123, "http://test.url"));
  });
});

describe("newLogger", () => {
  it("should format the message correctly", () => {
    const message = "Test message";
    const formattedMessage = customFormat({ message });

    expect(formattedMessage).toBe("Test message");
  });
});

describe("printPrefix", () => {
  it("should add a prefix to the message", () => {
    const message = "Hello, world!";
    const result = printPrefix(message);

    expect(result).toEqual(" - Hello, world!");
  });
});
