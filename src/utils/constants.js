export const UserRolesEnum ={
    ADMIN: 'admin',
    PROJECT_ADMIN:"project_admin",
    MEMBER: 'member'
}

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO : "ToDo",
    IN_PROGRESS : "InProgress",
    DONE : "Done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum);   
