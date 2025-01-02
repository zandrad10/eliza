/**
 * * Class representing a logging utility for Eliza application.
 * /
 * /
 */
class ElizaLogger {
/**
 * * Constructor for ElizaLogger class.
 * Initializes by checking if in Node.js environment, setting verbose based on environment, and logging initialization details.
 * /
 */
    constructor() {
        // Check if we're in Node.js environment
        this.isNode =
            typeof process !== "undefined" &&
            process.versions != null &&
            process.versions.node != null;

        // Set verbose based on environment
        this.verbose = this.isNode ? process.env.VERBOSE === "true" : false;

        // Add initialization logging
        console.log(`[ElizaLogger] Initializing with:
            isNode: ${this.isNode}
            verbose: ${this.verbose}
            VERBOSE env: ${process.env.VERBOSE}
            NODE_ENV: ${process.env.NODE_ENV}
        `);
    }

    private isNode: boolean;
    verbose = false;
    closeByNewLine = true;
    useIcons = true;
    logsTitle = "LOGS";
    warningsTitle = "WARNINGS";
    errorsTitle = "ERRORS";
    informationsTitle = "INFORMATIONS";
    successesTitle = "SUCCESS";
    debugsTitle = "DEBUG";
    assertsTitle = "ASSERT";

/**
 * Get the color styling for the console based on the foreground and background colors.
 * If the code is running in a browser environment, it will use CSS color values.
 * If the code is running in a Node.js environment, it will use ANSI escape code color values.
 * 
 * @param {string} foregroundColor - The foreground color to be used (default is "").
 * @param {string} backgroundColor - The background color to be used (default is "").
 * @returns {string} The CSS or ANSI escape code for the provided foreground and background colors.
 * /
```
 */
    #getColor(foregroundColor = "", backgroundColor = "") {
        if (!this.isNode) {
            // Browser console styling
            const colors: { [key: string]: string } = {
                black: "#000000",
                red: "#ff0000",
                green: "#00ff00",
                yellow: "#ffff00",
                blue: "#0000ff",
                magenta: "#ff00ff",
                cyan: "#00ffff",
                white: "#ffffff",
            };

            const fg = colors[foregroundColor.toLowerCase()] || colors.white;
            const bg = colors[backgroundColor.toLowerCase()] || "transparent";
            return `color: ${fg}; background: ${bg};`;
        }

        // Node.js console colors
        let fgc = "\x1b[37m";
        switch (foregroundColor.trim().toLowerCase()) {
            case "black":
                fgc = "\x1b[30m";
                break;
            case "red":
                fgc = "\x1b[31m";
                break;
            case "green":
                fgc = "\x1b[32m";
                break;
            case "yellow":
                fgc = "\x1b[33m";
                break;
            case "blue":
                fgc = "\x1b[34m";
                break;
            case "magenta":
                fgc = "\x1b[35m";
                break;
            case "cyan":
                fgc = "\x1b[36m";
                break;
            case "white":
                fgc = "\x1b[37m";
                break;
        }

        let bgc = "";
        switch (backgroundColor.trim().toLowerCase()) {
            case "black":
                bgc = "\x1b[40m";
                break;
            case "red":
                bgc = "\x1b[44m";
                break;
            case "green":
                bgc = "\x1b[44m";
                break;
            case "yellow":
                bgc = "\x1b[43m";
                break;
            case "blue":
                bgc = "\x1b[44m";
                break;
            case "magenta":
                bgc = "\x1b[45m";
                break;
            case "cyan":
                bgc = "\x1b[46m";
                break;
            case "white":
                bgc = "\x1b[47m";
                break;
        }

        return `${fgc}${bgc}`;
    }

/**
 * * Returns the color reset value.
 * @returns {string} The color reset value, "\x1b[0m" if running in Node environment, else an empty string.
 * /
 */
    #getColorReset() {
        return this.isNode ? "\x1b[0m" : "";
    }

/**
 * * Clears the console by using console.clear().
 * /
 */
    clear() {
        console.clear();
    }

/**
 * * Print a message with specified foreground and background colors.
 * 
 * @param {string} foregroundColor - The color of the text (default is "white").
 * @param {string} backgroundColor - The color of the background (default is "black").
 * @param {...any} strings - The strings to be printed.
 * /
 */
    print(foregroundColor = "white", backgroundColor = "black", ...strings) {
        // Convert objects to strings
        const processedStrings = strings.map((item) => {
            if (typeof item === "object") {
                return JSON.stringify(item, (key, value) =>
                    typeof value === "bigint" ? value.toString() : value
                );
            }
            return item;
        });

        if (this.isNode) {
            const c = this.#getColor(foregroundColor, backgroundColor);
            console.log(c, processedStrings.join(""), this.#getColorReset());
        } else {
            const style = this.#getColor(foregroundColor, backgroundColor);
            console.log(`%c${processedStrings.join("")}`, style);
        }

        if (this.closeByNewLine) console.log("");
    }

/**
 * * Logs messages with specified style options.
 * 
 * @param {any[]} strings - Array of strings to be logged.
 * @param {Object} options - Options for styling the log output.
 * @param {string} options.fg - Foreground color for the log output.
 * @param {string} options.bg - Background color for the log output.
 * @param {string} options.icon - Icon to be displayed with the log output.
 * @param {string} options.groupTitle - Title of the log group.
 * /
 */
    #logWithStyle(
        strings: any[],
        options: {
            fg: string;
            bg: string;
            icon: string;
            groupTitle: string;
        }
    ) {
        const { fg, bg, icon, groupTitle } = options;

        if (strings.length > 1) {
            if (this.isNode) {
                const c = this.#getColor(fg, bg);
                console.group(c, (this.useIcons ? icon : "") + groupTitle);
            } else {
                const style = this.#getColor(fg, bg);
                console.group(
                    `%c${this.useIcons ? icon : ""}${groupTitle}`,
                    style
                );
            }

            const nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach((item) => {
                this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) console.log();
        } else {
            this.print(
                fg,
                bg,
                strings.map((item) => {
                    return `${this.useIcons ? `${icon} ` : ""}${item}`;
                })
            );
        }
    }

/**
 * * Logs the specified strings with a custom style.
 * 
 * @param {...string} strings - The strings to be logged.
 * /
 */
    log(...strings) {
        this.#logWithStyle(strings, {
            fg: "white",
            bg: "",
            icon: "\u25ce",
            groupTitle: ` ${this.logsTitle}`,
        });
    }

/**
 * * Logs a warning message with specified style.
 * 
 * @param {...string} strings - The warning message text to be logged.
 * /
 */
    warn(...strings) {
        this.#logWithStyle(strings, {
            fg: "yellow",
            bg: "",
            icon: "\u26a0",
            groupTitle: ` ${this.warningsTitle}`,
        });
    }

/**
 * * Logs an error message with red text color, no background color, and a warning icon.
 * @param {...string} strings - The error message or messages to be logged.
 * /
 */
    error(...strings) {
        this.#logWithStyle(strings, {
            fg: "red",
            bg: "",
            icon: "\u26D4",
            groupTitle: ` ${this.errorsTitle}`,
        });
    }

/**
 * * Log information messages with specified style.
 * 
 * @param {...string} strings - The information messages to be logged.
 * /
 */
    info(...strings) {
        this.#logWithStyle(strings, {
            fg: "blue",
            bg: "",
            icon: "\u2139",
            groupTitle: ` ${this.informationsTitle}`,
        });
    }

/**
 * * Logs debug messages if verbose mode is enabled.
 * 
 * @param {...string} strings - The messages to be logged.
 * /
 */
    debug(...strings) {
        if (!this.verbose) {
            // for diagnosing verbose logging issues
            // console.log(
            //     "[ElizaLogger] Debug message suppressed (verbose=false):",
            //     ...strings
            // );
            return;
        }
        this.#logWithStyle(strings, {
            fg: "magenta",
            bg: "",
            icon: "\u1367",
            groupTitle: ` ${this.debugsTitle}`,
        });
    }

/**
 * * Logs a success message with green foreground color and checkmark icon.
 * 
 * @param {...string} strings - Strings to be logged as part of the success message.
 * /
 */
    success(...strings) {
        this.#logWithStyle(strings, {
            fg: "green",
            bg: "",
            icon: "\u2713",
            groupTitle: ` ${this.successesTitle}`,
        });
    }

/**
 * * Asserts the given strings with a cyan foreground color and an exclamation mark icon.
 * 
 * @param {string} ...strings The strings to assert
 * /
 */
    assert(...strings) {
        this.#logWithStyle(strings, {
            fg: "cyan",
            bg: "",
            icon: "\u0021",
            groupTitle: ` ${this.assertsTitle}`,
        });
    }

/**
 * * Displays a progress message either by clearing the current line and moving the cursor to the beginning,
 * or by logging the message to the console.
 * 
 * @param {string} message - The message to display as progress.
 * /
 */
    progress(message: string) {
        if (this.isNode) {
            // Clear the current line and move cursor to beginning
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(message);
        } else {
            console.log(message);
        }
    }
}

export const elizaLogger = new ElizaLogger();
elizaLogger.closeByNewLine = true;
elizaLogger.useIcons = true;

export default elizaLogger;
