import { ROLES } from '~/constants'

export const isOwner = (role) => role === ROLES.OWNER
export const isMaintainer = (role) => role === ROLES.MAINTAINER || isOwner(role)
export const isContributor = (role) =>
  role === ROLES.CONTRIBUTOR || isMaintainer(role)
export const isMember = (role) => Boolean(role)

export const canEditProjectInstant = (role) => isOwner(role)
export const canEditProjectQueued = (role) => isMaintainer(role)
export const canManageRoles = (role) => isOwner(role)
export const canApproveRequests = (role) => isOwner(role)

export const canCreateIssue = () => true

export const canEditAnyIssue = (role) => isMaintainer(role)
export const canDeleteIssue = (role, isOwnIssue) =>
  isMaintainer(role) || isOwnIssue
export const canMoveIssue = (role, isOwnIssue) =>
  isMaintainer(role) || (isContributor(role) && isOwnIssue)
export const canArchiveIssue = (role) => isMaintainer(role)

export const canAssignMembers = (role) => isMaintainer(role)

export const canComment = () => true
export const canEditComment = (role, isOwnComment) =>
  isOwnComment || isMaintainer(role)
export const canDeleteComment = (role, isOwnComment) =>
  isOwnComment || isMaintainer(role)
