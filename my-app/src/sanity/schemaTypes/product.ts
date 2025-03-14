import { Rule } from "sanity";

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'imagePath',
      title: 'Image Path',
      type: 'url',
    },
    {
      name: 'tags',
      title: 'Tags',
      description: 'Add tags like HeroSection, Top Picks, Featured Section, etc.',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
    },
    {
      name: 'amazonLink',
      title: 'Amazon Referral Link',
      type: 'url',
      validation: (Rule:Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).required(),
    },
  ],
};
