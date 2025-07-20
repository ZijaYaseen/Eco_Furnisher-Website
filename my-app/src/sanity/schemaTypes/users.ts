import { Rule } from "sanity"

export default {
    name: "user",
    title :"Users",
    type: "document",
    fields: [
        {
            name:"fullName",
            title:"Full Name",
            type:"string",
            validate:(Rule:Rule) => Rule.required()
        },
        {
            name:"email",
            title:"E-mail",
            type:"string",
            validate:(Rule:Rule) => Rule.required()
        },
        {
            name:"password",
            title:"Password",
            type:"string",
            hidden : true, // for Hide sensitive data in Sanity Dashboard
        },
        {
            name: "image",
            title: "Profile Image",
            type: "url",
            description: "User's profile picture from social login"
        },
        {
            name: "provider",
            title: "Login Provider",
            type: "string",
            options: {
                list: [
                    { title: "Email/Password", value: "credentials" },
                    { title: "Google", value: "google" },
                    { title: "Facebook", value: "facebook" }
                ]
            },
            initialValue: "credentials"
        },
        {
            name: "providerId",
            title: "Provider ID",
            type: "string",
            description: "Unique ID from social login provider"
        },
        {
            name: "emailVerified",
            title: "Email Verified",
            type: "datetime",
            description: "When the email was verified"
        },
        {
            name: "role",
            title: "Role",
            type: "string",
            options: {
                list: [
                    { title: "Admin", value: "admin" },
                    { title: "User", value: "user" },
                    { title: "Moderator", value: "moderator" }
                ],
            },
            validation: (Rule: Rule) => Rule.required(),
            initialValue: "user" // default role user ...
        },
        {
            name: 'resetToken',
            title: 'Reset Token',
            type: 'string',
            hidden: true,
        },
        {
            name: 'resetTokenExpiry',
            title: 'Reset Token Expiry',
            type: 'datetime',
            hidden: true,
        },
        {
            name: 'resetAttempts',
            title: 'Reset Attempts',
            type: 'number',
            hidden: true,
            description: 'Number of password reset attempts in the current window',
        },
        {
            name: 'resetWindowStart',
            title: 'Reset Window Start',
            type: 'datetime',
            hidden: true,
            description: 'Start time of the current reset attempt window',
        },
        {
            name: 'lastResetRequestTime',
            title: 'Last Reset Request Time',
            type: 'datetime',
            hidden: true,
            description: 'Timestamp of the last password reset request',
        },
    ]
}