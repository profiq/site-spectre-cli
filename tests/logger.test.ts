
import { formatConnectionMessage } from "../src/logger"

describe("formatConnectionMessage", () => {

  test('correctly formats the output', () => {
    console.log(formatConnectionMessage(3,123,200,123,"http://test.url"))
  });

})


