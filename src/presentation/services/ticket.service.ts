import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/iinterfaces/ticket";


export class TicketService {
	constructor() {}

	public readonly tickets: Ticket[] = [
		{
			id: UuidAdapter.v4(),
			number: 1,
			createdAt: new Date(),
			done: false
		},
		{
			id: UuidAdapter.v4(),
			number: 2,
			createdAt: new Date(),
			done: false
		},
		{
			id: UuidAdapter.v4(),
			number: 3,
			createdAt: new Date(),
			done: false
		},
		{
			id: UuidAdapter.v4(),
			number: 4,
			createdAt: new Date(),
			done: false
		},

	];

	private readonly workingOnTickets: Ticket[] = []

	public get pendingTickets() {
		return this.tickets.filter(ticket => !ticket.handleAtDesk);
	}

	public get lastWorkingTickets():Ticket[] {

		return this.workingOnTickets.splice(0, 4);

	}

	public get lastTicketNumber(): number {
		return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
	}

	public createTicket() {

		const newTicket: Ticket = {
			id: UuidAdapter.v4(),
			number: this.lastTicketNumber + 1,
			createdAt: new Date,
			done: false,
			handledAt: undefined,
			handleAtDesk: undefined,
		}

		this.tickets.push(newTicket);

		// todo: ws

		return newTicket;

	}

	public drawTicket( desk: string ) {

		// busco el que no esté asignado
		const ticket = this.tickets.find(t => !t.handleAtDesk);

		if (!ticket) {
            return {
				status: 'error',
				message: 'No hay tickets pendientes'
			}
        }

		ticket.handleAtDesk = desk;
		ticket.handledAt = new Date();

		this.workingOnTickets.unshift({ ...ticket })

		// todo: ws

		return {
			status: 'ok',
			ticket
		}

	}


	public onFinishedTicket ( id: string ) {

		const ticket = this.tickets.find( t => t.id === id );

		if (!ticket) {
			return {
				status: 'error',
				message: 'Ticket no encontrado'
			}
		}

		// ticket.done = true;

		this.tickets.map( t => {
			if (t.id === id) {
                t.done = true;
            }
			return ticket;
		});

		return { status: 'ok',}

	}


}
