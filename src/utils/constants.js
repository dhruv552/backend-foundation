export const UserRoleEnum ={
    ADMIN: 'admin',
    PROJECT_ADMIN:"project_admin",
    MEMBER: 'member'
}

export const AvailableRoles = Object.values(UserRoleEnum);

export const TaskStatusEnum = {
    TODO : "ToDo",
    IN_PROGRESS : "InProgress",
    DONE : "Done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum);   
