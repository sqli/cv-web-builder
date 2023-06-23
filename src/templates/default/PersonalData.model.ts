export type FirstName = string
export type LastName = string
export type MainRolePositionTitle = string
export type SecondaryPositionRoleTitle = string
export type Title = string
export type Enhance = boolean
export type TechnicalKnowledge = Knowledge[]
export type RoleTitle = string
export type Roles = RoleTitle[]
export type Tag = string
export type KnowledgeTags = Tag[]
export type Title1 = string
export type Description = string
export type CertificationsAwards = Knowledge1[]
export type ThisTextareaWillSupportMarkdown = string
export type MoveWorkExperienceToNewPage = boolean
export type TimePeriod = string
export type Position = string
export type Description1 = string

export interface PersonalData {
  firstName?: FirstName
  lastName?: LastName
  mainPositionRole?: MainRolePositionTitle
  secondaryPositionRole?: SecondaryPositionRoleTitle
  technicalKnowledge?: TechnicalKnowledge
  roles?: Roles
  hashTags?: KnowledgeTags
  certificationsAwards?: CertificationsAwards
  aboutYou?: AboutYou
  workExperience?: WorkExperience
  [k: string]: unknown
}
export interface Knowledge {
  title?: Title
  enhance?: Enhance
  [k: string]: unknown
}
export interface Knowledge1 {
  title?: Title1
  description?: Description
  [k: string]: unknown
}
export interface AboutYou {
  textarea?: ThisTextareaWillSupportMarkdown
  [k: string]: unknown
}
export interface WorkExperience {
  newPage?: MoveWorkExperienceToNewPage
  experience?: Experience[]
  [k: string]: unknown
}
export interface Experience {
  timePeriod?: TimePeriod
  position?: Position
  description?: Description1
  [k: string]: unknown
}
