<svelte:head>
	<title>Dev Chat - Veent</title>
</svelte:head>

<!-- Hero Header -->
<section class="relative overflow-hidden bg-slate-900 py-24 text-white">
	<div class="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-transparent to-purple-600/10"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<p class="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">Community</p>
			<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Dev Chat</h1>
			<p class="mt-6 text-lg leading-relaxed text-gray-400">
				A space for developers to collaborate and discuss.
			</p>
		</div>
	</div>
</section>

<!-- Coming Soon -->
<section class="bg-white py-20">
	<div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
		<div class="rounded-2xl border border-gray-100 bg-white p-12 shadow-sm">
			<!-- Chat icon -->
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
				<svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>

			<h2 class="text-2xl font-bold text-gray-900">Coming Soon</h2>
			<p class="mx-auto mt-4 max-w-md leading-relaxed text-gray-500">
				We're building a developer chat space where you can discuss features,
				report issues, and collaborate with the team. Stay tuned!
			</p>

			<!-- Status badge -->
			<div class="mt-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-700">
				<span class="h-2 w-2 animate-pulse rounded-full bg-indigo-500"></span>
				In Development
			</div>

			<!-- Feature preview -->
			<div class="mx-auto mt-10 grid max-w-md gap-4 text-left sm:grid-cols-2">
				{#each [
					{ icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z', title: 'Real-time Chat' },
					{ icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: 'Team Channels' },
					{ icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'Code Sharing' },
					{ icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', title: 'Notifications' }
				] as feature}
					<div class="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
						<svg class="h-5 w-5 shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={feature.icon} />
						</svg>
						<span class="text-sm font-medium text-gray-700">{feature.title}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
