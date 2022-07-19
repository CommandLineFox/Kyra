interface Roles {
    member?: string;
    unverified?: string;
}

interface Welcome {
    notification?: boolean;
    channel?: string;
    message?: string;
}

interface Config {
    prefix?: string;
    roles?: Roles;
    autoRemoveNsfw?: boolean;
    autoAddUnverified?: boolean;
    welcome?: Welcome;
}

export interface Guild {
    id: string;
    config: Config;
}
