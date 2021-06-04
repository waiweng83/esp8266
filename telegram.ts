/*******************************************************************************
 * Functions for Telegram
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Telegram API url.
const TELEGRAM_API_URL = "httptohttps.mrtimcakes.com"

namespace esp8266 {
    // Flag to indicate whether the Telegram message was sent successfully.
    let telegramMessageSent = false



    /**
     * Return true if the Telegram message was sent successfully.
     */
    //% subcategory="Telegram"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_telegram_message_sent
    //% block="Telegram message sent"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }



    /**
     * Send Telegram message.
     * @param apiKey Telegram API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="Telegram"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_telegram_message
    //% block="send message to Telegram:|API Key %apiKey|Chat ID %chatId|Message %message"
    export function sendTelegramMessage(apiKey: string, chatId: string, message: string) {

        // Reset the upload successful flag.
        telegramMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to Telegram. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + TELEGRAM_API_URL + "\",80", "OK", 10000) == false) return

        // Construct the data to send.
        //let data = "GET /https://api.telegram.org/bot" + apiKey + "/sendMessage?chat_id=" + chatId + "&text=" + message
        let data = "GET httptohttps.mrtimcakes.com/https://api.telegram.org/bot726049581:AAHoEupLxxZYnGWWsDUEITtN7nusAvgNHKs/getMe"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)
        
        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") return
        
        // Validate the response from Telegram.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") return

        // Set the upload successful flag and return.
        telegramMessageSent = true
        return
    }

}
