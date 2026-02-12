<svelte:head>
	<title>About - Veent</title>
</svelte:head>

<section class="relative overflow-hidden bg-slate-900 py-24 text-white">
	<div class="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-transparent to-purple-600/10"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<p class="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">About us</p>
			<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">About Veent</h1>
			<p class="mt-6 text-lg leading-relaxed text-gray-400">
				Building the tools that make event management effortless.
			</p>
		</div>
	</div>
</section>

<section class="bg-white py-20">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-2">
			<div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
				<div class="mb-5 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-3 shadow-lg">
					<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h2 class="mb-3 text-xl font-bold text-gray-900">Our Mission</h2>
				<p class="leading-relaxed text-gray-600">
					Veent provides powerful, easy-to-use tools for event organizers. Our Ticket Generator lets you
					create professional tickets, convention IDs, and certificates from CSV data — no design skills
					required.
				</p>
			</div>

			<div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
				<div class="mb-5 inline-flex rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3 shadow-lg">
					<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h2 class="mb-3 text-xl font-bold text-gray-900">What We Do</h2>
				<p class="leading-relaxed text-gray-600">
					From ticket design to batch export, we handle the entire workflow. Upload your attendee data,
					customize your design with QR codes and branding, and print or export — all from your browser.
				</p>
			</div>
		</div>

		<!-- Tech Stack -->
		<div class="mt-16">
			<div class="mb-8 text-center">
				<p class="text-sm font-semibold uppercase tracking-wider text-indigo-600">Tech Stack</p>
				<h2 class="mt-3 text-2xl font-bold text-gray-900">Built With Modern Tools</h2>
			</div>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{#each [
					{ name: 'SvelteKit', desc: 'Frontend Framework', icon: 'from-orange-500 to-red-500' },
					{ name: 'Payload CMS', desc: 'Backend & API', icon: 'from-blue-500 to-cyan-500' },
					{ name: 'Tailwind CSS', desc: 'Styling', icon: 'from-sky-400 to-blue-500' },
					{ name: 'PostgreSQL', desc: 'Database', icon: 'from-indigo-500 to-blue-600' }
				] as tech}
					<div class="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
						<div class="mx-auto mb-3 h-2 w-12 rounded-full bg-gradient-to-r {tech.icon}"></div>
						<p class="font-bold text-gray-900">{tech.name}</p>
						<p class="mt-1 text-xs text-gray-500">{tech.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
