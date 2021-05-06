/**
 * MakeCode extension for ESP8266 Wifi module.
 */

/**
 * Blocks for ESP8266 WiFi module.
 */
//% weight=10 color=#ff8000 icon="\uf085" block="ESP8266 WiFi"
namespace esp8266 {
    // Flag to indicate whether the ESP8266 was initialized successfully.
    let initialized = false



    // Send AT command and wait for response.
    // Return true if expected command is received, false otherwise.
    function sendCommand(command: string, expected_response: string = null, timeout: number = 100): boolean {
        // Flush the Rx buffer.
        serial.readString()

        // Send the command and end with "\r\n".
        serial.writeString(command + "\r\n")
        
        // Don't check if expected response is not specified.
        if (expected_response == null) {
            return true
        }
        
        // Wait and verify the response.
        let rxData = ""
        let result = false
        let timestamp = input.runningTime()
        while (true) {
            // Timeout.
            if (input.runningTime() - timestamp > timeout) {
                result = false
                break
            }

            // Read until the end of the line.
            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                // Check if expected response received.
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(expected_response)) {
                    result = true
                    break
                }

                // Trim the Rx data before loop again.
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }

        basic.pause(100)
        return result
    }



    // Get the response from ESP8266.
    // Return the line start with the expected response.
    function getResponse(expected_response: string, timeout: number = 100): string {
        let rxData = ""
        let timestamp = input.runningTime()
        while (true) {
            // Timeout.
            if (input.runningTime() - timestamp > timeout) {
                rxData = ""
                break
            }

            // Read until the end of the line.
            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                // Check if expected response received.
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(expected_response)) {
                    rxData = rxData.slice(rxData.indexOf(expected_response), rxData.indexOf("\r\n"))
                    break
                }

                // Trim the Rx data before loop again.
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }

        return rxData
    }



    /**
     * Return true if the ESP8266 is already initialized.
     */
    //% subcategory="WiFi"
    //% weight=20
    //% blockGap=8
    //% blockId=esp8266_is_esp8266_initialized
    //% block="ESP8266 initialized"
    export function isESP8266Initialized(): boolean {
        return initialized
    }



    /**
     * Initialize the ESP8266.
     * @param tx Tx pin of micro:bit. eg: SerialPin.P16
     * @param rx Rx pin of micro:bit. eg: SerialPin.P15
     * @param baudrate UART baudrate. eg: BaudRate.BaudRate115200
     */
    //% subcategory="WiFi"
    //% weight=19
    //% blockGap=40
    //% blockId=esp8266_init
    //% block="initialize ESP8266: Tx %tx Rx %rx Baudrate %baudrate"
    export function init(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        // Redirect the serial port.
        serial.redirect(tx, rx, baudrate)

        // Restore the ESP8266 factory settings.
        initialized = sendCommand("AT+RESTORE", "ready", 1000)
    }



    /**
     * Return true if the ESP8266 is connected to WiFi router.
     */
    //% subcategory="WiFi"
    //% weight=18
    //% blockGap=8
    //% blockId=esp8266_is_wifi_connected
    //% block="WiFi connected"
    export function isWifiConnected(): boolean {
        // Get the connection status.
        sendCommand("AT+CIPSTATUS")
        let status = getResponse("STATUS:")

        // Return the WiFi status.
        if ((status == "") || status.includes("STATUS:5")) {
            return false
        }
        else {
            return true
        }
    }



    /**
     * Connect to WiFi router.
     * @param ssid Your WiFi SSID.
     * @param password Your WiFi password.
     */
    //% subcategory="WiFi"
    //% weight=17
    //% blockGap=8
    //% blockId=esp8266_connect_wifi
    //% block="connect to WiFi: SSID %ssid Password %password"
    export function connectWiFi(ssid: string, password: string) {
        // Set to station mode.
        sendCommand("AT+CWMODE=1", "OK")

        // Restart.
        sendCommand("AT+RST", "ready", 1000)

        // Connect to WiFi router.
        sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", "OK", 20000)
    }



    
}
