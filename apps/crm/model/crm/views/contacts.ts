import { DataGridViewModel } from 'app2-common';

export const crmContacts: DataGridViewModel = {
  type: 'DataGridView',
  hint: 'Individuals associated with an account, such as a customer or vendor representative',
  parent: 'crmBase',
  label: 'Contacts',
  table: 'crm_contacts',
  labelField: 'name',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'StringField',
      hint: 'The full name of the contact',
      computed: ({ data }) => (data.firstName ?? '') + ' ' + (data.lastName ?? ''),
      required: true
    },
    {
      name: 'firstName',
      label: 'First Name',
      type: 'StringField',
      hint: 'The first name of the contact'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'StringField',
      hint: 'The last name of the contact'
    },
    {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'StringField',
      hint: 'The job title of the contact'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'StringField',
      hint: 'The phone number of the contact',
      validators: ['phoneNumber']
    },
    {
      name: 'email',
      label: 'Email',
      type: 'StringField',
      hint: 'The email address of the contact',
      validators: ['email']
    },
    {
      name: 'mailingAddress',
      label: 'Mailing Address',
      type: 'StringField',
      hint: 'The mailing address of the contact'
    },
    {
      name: 'account',
      type: 'LookupField',
      hint: 'The account the contact is associated with',
      relatedView: 'crmAccounts'
    },
    {
      name: 'activities',
      type: 'DataGridField',
      hint: 'A list of activities associated with the contact',
      relatedView: 'activities',
      relatedField: 'dataId'
    },
    {
      name: 'crmCases',
      type: 'DataGridField',
      hint: 'A list of crmCases associated with the contact',
      relatedView: 'crmCases',
      relatedField: 'contact'
    }
  ]
};
