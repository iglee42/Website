export type FileType = {
    id: number;
    name: string;
    allowed_types: string;
}

export type Contest = {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    submissions_open: Date;
    end_at: Date;
    ask_file: boolean;
    file_type: FileType;
}