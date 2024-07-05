interface Image {
    id: number | null;
    realAge: number | null;
    imgPath: string;
}

export interface Game {
    gameId: number | null;
    username1: string | null;
    username2: string | null;
    is_pvp: boolean;
    is_pvai: boolean;
    image: Image | null;
    user1_answer: number | null;
    user2_answer: number | null;
    ai_answer: number | null;
    tip_ai: string | null;
    winner: string | null;
}