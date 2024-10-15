declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Exercise {
			title: string;
			description: string;
			duration: number;
		}

		interface TimedExercise extends Exercise {
			start: number;
			end: number;
		}
	}
}

export {};
