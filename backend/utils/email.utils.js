import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendAccessRequestEmail = async (userEmail, userName, role) => {
    const adminEmail = process.env.EMAIL; 
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // 1. Email to the User
    const userMailOptions = {
        from: `InventPro Admin <${process.env.EMAIL}>`,
        to: userEmail,
        subject: 'Access Request Submitted - InventPro',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">Access Request Received</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Thank you for requesting access to <strong>InventPro</strong>.</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 5px solid #4f46e5; margin: 20px 0;">
                    <p style="margin: 0; color: #374151; font-weight: bold;">"I have received your request and I will send your request information to the system administrator for approval."</p>
                </div>
                <p>To follow up or if you have any urgent questions, you can contact the administrator at:</p>
                <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 16px; color: #1f2937;">${adminEmail}</p>
                <p>You will receive another email once your request has been processed.</p>
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
                    <p>This is an automated message from InventPro Inventory Management System.</p>
                </div>
            </div>
        `
    };

    // 2. Email to the Admin
    const adminMailOptions = {
        from: `System Notification <${process.env.EMAIL}>`,
        to: adminEmail,
        subject: 'New Access Request Alert - InventPro',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; border-top: 5px solid #ef4444;">
                <h2 style="color: #111827; margin-bottom: 20px;">Manual Approval Required</h2>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold; width: 40%;">Applicant Name</td>
                            <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${userName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Email Address</td>
                            <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${userEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Requested Role</td>
                            <td style="padding: 10px 0;">
                                <span style="background-color: #fef3c7; color: #92400e; padding: 4px 10px; rounded-full; font-size: 12px; font-weight: bold; text-transform: uppercase;">${role}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="${frontendUrl}/dashboard/users" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        Review Request in Admin Panel
                    </a>
                </div>
                
                <p style="margin-top: 30px; color: #64748b; font-size: 13px; text-align: center; line-height: 1.6;">
                    Please login to the InventPro Dashboard to <strong>Accept</strong> or <strong>Decline</strong> this request. Actions performed in the dashboard will automatically notify the user.
                </p>
            </div>
        `
    };

    try {
        // Send both emails
        await Promise.all([
            transporter.sendMail(userMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);
        console.log(`Access request notifications sent for: ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending emails:', error);
        return false;
    }
};

export const sendApprovalEmail = async (userEmail, userName, tempPassword = null) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    let passwordHTML = '';
    if (tempPassword) {
        passwordHTML = `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #fcd34d; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-weight: bold;">Temporary Credentials:</p>
                <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 16px;">Password: <span style="background-color: #ffffff; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #b45309;">Please change your password after your first login.</p>
            </div>
        `;
    }

    const mailOptions = {
        from: `InventPro Admin <${process.env.EMAIL}>`,
        to: userEmail,
        subject: 'Access Request Approved - InventPro',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4f46e5; margin: 0;">InventPro</h1>
                    <p style="color: #6b7280; font-size: 14px;">Inventory Management System</p>
                </div>
                
                <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Request Approved</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Welcome to the team! Your access request has been approved.</p>
                
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 5px solid #10b981; margin: 20px 0;">
                    <p style="margin: 0; color: #374151; font-weight: bold;">"The request will be approved, login."</p>
                </div>

                ${passwordHTML}

                <div style="margin-top: 30px; text-align: center;">
                    <a href="${frontendUrl}/login" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        Login to Your Dashboard
                    </a>
                </div>
                
                <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    If you have any questions or need assistance, please contact the administrator.
                </p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #9ca3af; text-align: center;">
                    <p>This is an automated message from InventPro. Please do not reply to this email.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to: ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending approval email:', error);
        return false;
    }
};
export const sendRejectionEmail = async (userEmail, userName, reason = null) => {
    const adminEmail = process.env.EMAIL;
    
    const mailOptions = {
        from: `InventPro Admin <${process.env.EMAIL}>`,
        to: userEmail,
        subject: 'Access Request Denied - InventPro',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Request Denied</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Thank you for your interest in <strong>InventPro</strong>.</p>
                <p>After reviewing your access request, we regret to inform you that your application has been <strong>denied</strong> at this time.</p>
                
                ${reason ? `
                <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; border-left: 5px solid #ef4444; margin: 20px 0;">
                    <p style="margin: 0; color: #b91c1c; font-weight: bold;">"Reason: ${reason}"</p>
                </div>
                ` : ''}
                
                <p>If you believe this was in error, you can contact the administrator at:</p>
                <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 16px; color: #1f2937;">${adminEmail}</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #9ca3af; text-align: center;">
                    <p>This is an automated message from InventPro. Please do not reply to this email.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent to: ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending rejection email:', error);
        return false;
    }
};

export const sendInvoiceEmail = async (userEmail, userName, invoice) => {
    // Note: In a real app, you would attach the PDF here as well.
    const mailOptions = {
        from: `InventPro Billing <${process.env.EMAIL}>`,
        to: userEmail,
        subject: `Invoice ${invoice.invoiceNumber} from InventPro`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4f46e5; margin: 0;">InventPro</h1>
                    <p style="color: #6b7280; font-size: 14px;">Inventory Management System</p>
                </div>
                
                <h2 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Invoice Generated</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>An invoice has been generated for your recent transaction.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Invoice Number</td>
                            <td style="padding: 10px 0; color: #1e293b; font-size: 14px; text-align: right;">${invoice.invoiceNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Amount Due</td>
                            <td style="padding: 10px 0; color: #4f46e5; font-size: 18px; font-weight: 800; text-align: right;">$${invoice.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Due Date</td>
                            <td style="padding: 10px 0; color: #1e293b; font-size: 14px; text-align: right;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: bold;">Status</td>
                            <td style="padding: 10px 0; text-align: right;">
                                <span style="background-color: ${invoice.status === 'paid' ? '#d1fae5' : '#fee2e2'}; color: ${invoice.status === 'paid' ? '#065f46' : '#991b1b'}; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${invoice.status}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                    You can view and manage your billing history in the InventPro portal.
                </p>
                
                <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        Access Billing Portal
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #9ca3af; text-align: center;">
                    <p>Designed and Managed by InventPro Billing Intelligence.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent to: ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending invoice email:', error);
        return false;
    }
};
