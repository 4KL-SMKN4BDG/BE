export const resetPasswordEmailTemplate = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 10px;">
<tr>
<td align="center">

<!-- MAIN CONTAINER -->
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="padding:30px 40px 10px 40px; text-align:center;">
<h1 style="margin:0; font-size:24px; color:#222;">
Reset your password
</h1>
</td>
</tr>

<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;">
<hr style="border:none; border-top:1px solid #eee;">
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:20px 40px; text-align:center;">

<p style="color:#555; font-size:14px; line-height:1.6; margin-bottom:15px;">
Hello <b>${name}</b>,
</p>

<p style="color:#555; font-size:14px; line-height:1.6; margin-bottom:20px;">
We received a request to reset your password for your 4KL account.
</p>

<p style="color:#555; font-size:14px; margin-bottom:25px;">
Click the button below to set a new password:
</p>

<!-- BUTTON -->
<a href="${resetLink}" 
   style="
    display:inline-block;
    padding:14px 28px;
    background:linear-gradient(135deg,#2ecc71,#27ae60);
    color:#ffffff;
    text-decoration:none;
    border-radius:30px;
    font-size:13px;
    font-weight:bold;
   ">
   RESET PASSWORD
</a>

<!-- FALLBACK LINK
<p style="font-size:12px; color:#999; margin-top:25px; line-height:1.5;">
If the button doesn’t work, copy and paste this link into your browser:
</p>

<p style="font-size:12px; word-break:break-all; color:#2ecc71;">
${resetLink}
</p> -->

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#0f172a; color:#ffffff; padding:30px 40px; text-align:left;">

<h2 style="margin:0 0 15px 0; font-size:16px;">
4KL SMKN 4 Bandung
</h2>

<hr style="border:none; border-top:1px solid #334155; margin-bottom:15px;">

<p style="font-size:12px; color:#cbd5e1; line-height:1.6;">
If you didn’t request a password reset, you can safely ignore this email.
</p>

<p style="font-size:11px; color:#94a3b8; margin-top:10px;">
© 4KL SMKN 4 Bandung. All rights reserved
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;