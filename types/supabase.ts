export type Profile = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    team_name: string | null;
    avatar_url: string | null;
};

export type Event = {
    id: string;
    name: string;
    date_start: string;
    date_end: string;
    status: 'draft' | 'published' | 'archived';
    visibility: 'public' | 'private';
    venue: string | null;
    description: string | null;
    hero_image_url: string | null;
};

export type Class = {
    id: string;
    event_id: string;
    name: string;
    price: number;
    capacity: number;
};

export type Entry = {
    id: string;
    event_id: string;
    class_id: string;
    profile: string;
    status: 'pending' | 'confirmed' | 'waitlist' | 'cancelled';
    driver_name: string;
    driver_email: string;
    kart_number: string | null;
    created_at: string;
};

export type Team = {
    id: string;
    name: string;
    logo: string | null;
    owner: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    created_by: string | null;
    updated_by: string | null;
};

export type TeamMember = {
    id: string;
    team: string;
    profile: string;
    role: string[];
    created_at: string;
    created_by: string | null;
    updated_by: string | null;
};

export type Document = {
    id: string;
    entry_id: string | null;
    profile: string | null;
    file_name: string;
    file_url: string;
    document_type: string;
    created_at: string;
};

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Profile;
                Update: Partial<Profile>;
            };
            events: {
                Row: Event;
                Insert: Omit<Event, 'id'>;
                Update: Partial<Event>;
            };
            classes: {
                Row: Class;
                Insert: Omit<Class, 'id'>;
                Update: Partial<Class>;
            };
            entries: {
                Row: Entry;
                Insert: Omit<Entry, 'id' | 'created_at'>;
                Update: Partial<Entry>;
            };
            teams: {
                Row: Team;
                Insert: Omit<Team, 'id'>;
                Update: Partial<Team>;
            };
            team_members: {
                Row: TeamMember;
                Insert: Omit<TeamMember, 'id'>;
                Update: Partial<TeamMember>;
            };
            documents: {
                Row: Document;
                Insert: Omit<Document, 'id' | 'created_at'>;
                Update: Partial<Document>;
            };
        };
    };
};
