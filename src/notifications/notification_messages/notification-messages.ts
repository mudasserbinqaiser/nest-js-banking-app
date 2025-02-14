export const NotificationMessages = {
    userCreated: (name: string, email: string) => ({
      subject: "Welcome to Our Bank!",
      body: `Dear ${name},\n\nWelcome to our banking platform. Your account with email ${email} has been successfully created.\n\nBest Regards,\nBank Team`
    }),
  
    accountCreated: (accountNumber: string, userEmail: string) => ({
      subject: "Your New Bank Account is Ready!",
      body: `Dear Customer,\n\nYour bank account (No: ${accountNumber}) has been successfully created and linked to your email ${userEmail}.\n\nThank you for banking with us.`
    }),
  
    fundsAdded: (amount: number, accountNumber: string) => ({
      subject: "Funds Added Successfully!",
      body: `Your deposit of $${amount} has been successfully credited to your account (No: ${accountNumber}).`
    }),
  
    transactionCompleted: (amount: number, fromAccount: string, toAccount: string) => ({
      subject: "Transaction Completed Successfully",
      body: `A transaction of $${amount} has been successfully processed from account ${fromAccount} to ${toAccount}.`
    }),
  
    accountSuspended: (accountNumber: string) => ({
      subject: "Your Account Has Been Suspended",
      body: `Your bank account (No: ${accountNumber}) has been suspended due to security reasons. Please contact support.`
    }),
  
    userBanned: (email: string) => ({
      subject: "Your Account Has Been Banned",
      body: `Your bank account associated with ${email} has been permanently banned due to policy violations.`
    }),
  
    adminAlert: (message: string) => ({
      subject: "⚠️ Urgent Admin Notification",
      body: `Admin Alert:\n\n${message}`
    }),

    reportGenerated: (format: string, filePath: string) => ({
      subject: `Your ${format.toUpperCase()} Report is Ready`,
      body: `Dear Customer,\n\nYour requested ${format.toUpperCase()} report has been generated successfully.\n\nYou can download it from: ${filePath}.\n\nBest Regards,\nBank Team`
  }),

  passwordReset: (email: string, resetLink: string) => ({
      subject: "Password Reset Request",
      body: `Dear User,\n\nA request has been made to reset your password for the account associated with ${email}.\n\nClick the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nBank Security Team`
  }),

  loginAlert: (email: string, ipAddress: string) => ({
      subject: "New Login Alert",
      body: `Dear User,\n\nYour account (${email}) was accessed from a new device or location.\n\nIP Address: ${ipAddress}\n\nIf this was not you, please secure your account immediately.\n\nBest Regards,\nBank Security Team`
  }),

  monthlyStatement: (name: string) => ({
    subject: "Your Monthly Account Statement",
    body:`Dear ${name},\n\nYour monthly account statement is now available. Please find the attached document.\n\nBest Regards,\nBank Team`,
  }),
};
  