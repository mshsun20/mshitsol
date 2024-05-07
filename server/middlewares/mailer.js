const nodemailer = require('nodemailer')

const SendMailer = async (frm_nm, frm_eml, to_nm, to_eml, cc_eml, bcc_eml, otpcode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${frm_eml}`,
            pass: process.env.GMAIL_APP_KEY
        }
    })

    try {
        const mailOptions = {
            from: `${frm_nm} <${frm_eml}>`,
            to: `"${to_nm}" <${to_eml}>`,
            cc: (cc_eml!==null)&&`"Super Admin" <${cc_eml}>`,
            bcc: `"Dev Team" <${bcc_eml}>`,
            subject: `MSH IT Solution Login`,
            text: `Welcome to MSH IT Solution`,
            html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <script async src="https://cdn.ampproject.org/v0.js"></script>
                    <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
                </head>
                <body>
                    <p>To Reset Password Submit following Code:</p>
                    <p>Confirmation Code: ${otpcode}<br/>
                    <p>Code Expires after 5 mins.</p>
                </body>
                </html>`
        }
        const result = await transporter.sendMail(mailOptions)
        return result
    } catch (error) {
        console.error(error)
    }
}

module.exports = SendMailer