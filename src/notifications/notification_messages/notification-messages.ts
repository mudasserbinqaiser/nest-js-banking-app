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
    })
  };
  