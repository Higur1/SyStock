export const templateHtml = (token, instance) => {
    const link =`http://${instance}/reset/password/${token}`

    return `<!DOCTYPE html>
    <html>
    <head>
    
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Password Reset</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="background-color: #e9ecef;">
    
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            This is a reset password email for Systock.
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
            <tr>
                <td align="center" bgcolor="#e9ecef">
    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 36px 24px;">

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
    
            <tr>
                <td align="center" bgcolor="#e9ecef">
    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; ">
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; border-radius: 20px 20px 0px 0px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; ">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Your Password</h1>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Tap the button below to reset your Systock account password. If you didn't request a new password, you can safely delete this email. The duration of this generated link is 1 hour, after said period the link will no longer be valid.</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                            <table border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center" bgcolor="#FFA500" style="border-radius: 6px;">
                                                        <a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Set-up your new password</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                <p style="margin: 0;"><a href="${link}" target="_blank">${link}</a></p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; border-radius: 0px 0px 20px 20px ; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">Cheers,<br> Systock</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                <p style="margin: 0;">You received this email because we received a request for password reset for your account. If you didn't request a reset to your password you can safely delete this email.</p>
                            </td>
                        </tr>
    
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
}