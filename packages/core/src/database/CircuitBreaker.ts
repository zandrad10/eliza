/**
 * * Definition of CircuitBreakerState type which can have one of three possible values: "CLOSED", "OPEN", or "HALF_OPEN".
 * /
 */
export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

/**
 * * Class representing a Circuit Breaker.
 * /
 */
export class CircuitBreaker {
    private state: CircuitBreakerState = "CLOSED";
    private failureCount: number = 0;
    private lastFailureTime?: number;
    private halfOpenSuccesses: number = 0;

    private readonly failureThreshold: number;
    private readonly resetTimeout: number;
    private readonly halfOpenMaxAttempts: number;

/**
 * * Constructor for creating a new instance of a class.
 * @param {Object} config - Configuration object.
 * @param {number} [config.failureThreshold] - The failure threshold value.
 * @param {number} [config.resetTimeout] - The reset timeout value.
 * @param {number} [config.halfOpenMaxAttempts] - The maximum attempts in half-open state.
 * /
 */
    constructor(
        private readonly config: {
            failureThreshold?: number;
            resetTimeout?: number;
            halfOpenMaxAttempts?: number;
        } = {}
    ) {
        this.failureThreshold = config.failureThreshold ?? 5;
        this.resetTimeout = config.resetTimeout ?? 60000;
        this.halfOpenMaxAttempts = config.halfOpenMaxAttempts ?? 3;
    }

/**
 * * Executes the provided operation within the circuit breaker pattern.
 * If the circuit breaker is OPEN, it checks if it's time to transition to HALF_OPEN state.
 * If the operation is successful in HALF_OPEN state, it allows a certain number of consecutive successes before
 * transitioning back to CLOSED state.
 * If the operation fails, it handles the failure and throws the error.
 * 
 * @template T The type of the result that the operation will return.
 * @param {() => Promise<T>} operation The operation to be executed within the circuit breaker.
 * @returns {Promise<T>} The result of the operation.
 * @throws {Error} If the circuit breaker is OPEN or if the operation fails.
 * /
 */
    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === "OPEN") {
            if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
                this.state = "HALF_OPEN";
                this.halfOpenSuccesses = 0;
            } else {
                throw new Error("Circuit breaker is OPEN");
            }
        }

        try {
            const result = await operation();

            if (this.state === "HALF_OPEN") {
                this.halfOpenSuccesses++;
                if (this.halfOpenSuccesses >= this.halfOpenMaxAttempts) {
                    this.reset();
                }
            }

            return result;
        } catch (error) {
            this.handleFailure();
            throw error;
        }
    }

/**
 * * Increments the failure count and sets the last failure time.
 * If the failure count exceeds the threshold, sets the state to "OPEN".
 * /
 */
    private handleFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.state !== "OPEN" && this.failureCount >= this.failureThreshold) {
            this.state = "OPEN";
        }
    }

/**
 * * Reset the state, failure count, and last failure time of the object to initial values.
 * /
 */
    private reset(): void {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.lastFailureTime = undefined;
    }

/**
 * * Get the current state of the object.
 * 
 * @returns {"CLOSED" | "OPEN" | "HALF_OPEN"} The current state of the object.
 * /
 */
    getState(): "CLOSED" | "OPEN" | "HALF_OPEN" {
        return this.state;
    }
}
