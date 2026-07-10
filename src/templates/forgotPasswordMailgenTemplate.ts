export default function forgotPasswordMailgenContent(username: string = "Dear User", forgotPasswordUrl: string) {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset the password for your AuthNext account.",

      action: {
        instructions:
          "Click the button below to reset your password. This link will expire after a limited time for security reasons.",
        button: {
          color: "#dc2626",
          text: "Reset Password",
          link: forgotPasswordUrl,
        },
      },

      outro: [
        "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
        "If the button doesn't work, copy and paste the following URL into your browser:",
        forgotPasswordUrl,
      ],

      signature: "Best Regards",
    },
  }
}
