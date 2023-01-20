import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { handleRequest } from "./root.js";

describe("app", () => {
  describe("handleRequest", () => {
    let res;
    let getTimestamp;

    beforeEach(() => {
      getTimestamp = jest.fn().mockReturnValue(1);
      res = {
        send: jest.fn(),
      };
    });

    describe("always", () => {
      beforeEach(() => handleRequest(res, getTimestamp));

      it("should send HTTP 200 status code", () =>
        expect(res.statusCode).toBe(200));
      it("should send Content-Type of application/json", () =>
        expect(res.contentType).toBe("application/json"));
    });

    describe("when a static message is configured in the environment", () => {
      beforeEach(() => {
        process.env.STATIC_MESSAGE = "test";
        handleRequest(res, getTimestamp);
      });

      it("should include the message from the environment in the response body", () =>
        expect(res.send).toHaveBeenCalledWith({
          message: "test",
          timestamp: expect.any(Number),
        }));
    });
    
    describe("when a static message is not configured in the environment", () => {
      beforeEach(() => {
        delete process.env.STATIC_MESSAGE;
        handleRequest(res, getTimestamp);
      });

      it("should include the default message in the response body", () =>
        expect(res.send).toHaveBeenCalledWith({
          message: "Automate all the things!",
          timestamp: expect.any(Number),
        }));
    });

    describe('timestamp', () => {
      beforeEach(() => {
        getTimestamp.mockReturnValue(12345);
        handleRequest(res, getTimestamp);
      });
      it('should match the timestamp provided from getTimestamp()', () => expect(res.send).toHaveBeenCalledWith({
        message: expect.any(String),
        timestamp: 12345
      }));
    });
  });
});
