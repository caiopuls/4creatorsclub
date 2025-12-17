import { createClient } from '@/lib/supabase/server'
import { MyAssetsView } from './_components/MyAssetsView'

export default async function MyAssetsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch in parallel for speed
    const [
        { data: createdJobs },
        { data: jobApplications },
        { data: createdStartups },
        { data: favorites }
    ] = await Promise.all([
        supabase
            .from('jobs')
            .select('*, profiles(full_name, role), applications(*, profiles(*))')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),

        supabase
            .from('applications')
            .select('job_id, jobs(*, profiles(full_name, role)), status, created_at')
            .eq('applicant_id', user.id)
            .order('created_at', { ascending: false }),

        supabase
            .from('startups')
            .select('*, startup_interests(*, profiles(*))')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),

        supabase
            .from('favorites')
            .select('id, job_id, startup_id, jobs(*, profiles(*)), startups(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
    ])

    return (
        <MyAssetsView
            createdJobs={createdJobs || []}
            jobApplications={jobApplications || []}
            createdStartups={createdStartups || []}
            favorites={favorites || []}
        />
    )
}
