<template>
    <main class="cont">
        <br />
        <h1>Investment successful!</h1>
        <h5 style="opacity: 0.8">
            You have successfully invested
            <span class="green">{{
                $route?.query?.amt
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
            in <span class="green">{{ $route?.query?.company }}</span>.
        </h5>

        <h5 style="font-size: 1.2em">
            <router-link :to="`/company/${$route?.query?.compuser}`">
                View company &rarr;
            </router-link>
        </h5>
        <br /><br /><br />
        <br /><br /><br />
        <br /><br /><br />
        <br /><br />
    </main>
</template>

<script>
export default {}
</script>

<style scoped></style>