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
        }
        
    ]
}