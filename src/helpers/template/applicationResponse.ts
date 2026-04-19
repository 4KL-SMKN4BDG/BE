export const applicationResponseEmailTemplate = (
  studentName: string,
  companyName: string,
  response: "APPROVED" | "REJECTED"
) => {
  const isApproved = response === "APPROVED";

  const color = isApproved ? "#2ecc71" : "#e74c3c";
  const bgGradient = isApproved
    ? "linear-gradient(135deg,#2ecc71,#27ae60)"
    : "linear-gradient(135deg,#e74c3c,#c0392b)";
  const message = isApproved
    ? "Congratulations! Your application has been approved."
    : "We regret to inform you that your application has been rejected.";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PKL Application Status</title>
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
PKL Application Result
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
Hello <b>${studentName}</b>,
</p>

<p style="color:#555; font-size:14px; line-height:1.6; margin-bottom:15px;">
Your application for PKL at <b>${companyName}</b> has been reviewed.
</p>

<p style="color:#555; font-size:14px; margin-bottom:25px;">
${message}
</p>

<!-- STATUS BADGE -->
<div style="
  display:inline-block;
  padding:12px 26px;
  background:${bgGradient};
  color:#ffffff;
  border-radius:30px;
  font-size:13px;
  font-weight:bold;
">
  Your Application was ${response}
</div>

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
This is an automated message regarding your PKL application.
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
};