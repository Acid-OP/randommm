// Linear API Types

// User - Person in Linear workspace
export interface User {
    id: string;
    name: string;
    email: string;
}

// Team - Workspace team (e.g., Engineering, Design)
export interface Team {
    id: string;
    name: string;
    key: string;
}

// IssueState - Status of an issue (Todo, In Progress, Done)
export interface IssueState {
    id: string;
    name: string;
    type: string;
    color: string;
}

// Label - Tag for categorizing issues (bug, feature, urgent)
export interface Label {
    id: string;
    name: string;
    color: string;
}

// Comment - Comment on an issue
export interface Comment {
    id: string;
    body: string;
    createdAt: string;
    user?: User;
}

// Issue - Main task/issue object
export interface Issue {
    id: string;
    title: string;
    description?: string;
    state?: IssueState;
    priority?: number;    // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
    assignee?: User;
    labels?: Label[];
    team: Team;
    url: string;
    createdAt: string;
    updatedAt: string;
}

// Project - Linear project
export interface Project {
    id: string;
    name: string;
    description?: string;
}