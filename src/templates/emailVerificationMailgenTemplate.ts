function emailVerificationMailgenContent(verificationUrl: string, username = "Dear User") {
  return {
    body:
    {
      name: username,
      intro: "Welcome to AuthNext! Thanks for creating an account.",
      action: {
        instructions: "To verify your email address and activate your account, please click the button below:",
        button: {
          color: "#2563eb",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro: [
        "If you did not create an account, you can safely ignore this email.",
        "If the button doesn't work, copy and paste the following URL into your browser: ", verificationUrl
      ],
      signature: "Best Regards",
    }
  }
}

export default emailVerificationMailgenContent;
