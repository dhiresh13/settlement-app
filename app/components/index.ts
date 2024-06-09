
 
 export interface ChatListItem {
    id: number;
    name: string;
  }

  export type ChatLayoutProps = {
    id:number;
  };

  export interface Message {
    id: number;
    text: string;
    updated_at: string;
    updated_by: number;
    status: string;
  }

  export interface MessageProps {
    message: Message;
    user: number;
    api:url;
  }

  export type url=string;

  export interface ChatInputType{
    status:string;
    updated_by:string;
  }

  export type ChatInputProps={
    user:number;
    api:url;
   lastUpdate:Message
  }

export type StatusProps={
  pending:boolean
  objection:boolean
  settled:boolean
  initial:boolean,
}
