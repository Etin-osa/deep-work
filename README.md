# Deep work V1.0

+ Make sure id of each tasks is unique not by 'b-' or 'w-' ✅
+ Change code in cycles to search for type and id
+ Create the new redux data structure
+ Session (
    id: string
    title: string
    userId: string
    active: boolean
    lastModified: string
    tasks: [
        id: string
        type: SlotType
        duration: number
        title: string
        status?: "skipped" | "completed" // Set to undefined after a completed session
        skipTime?: number // Set to undefined after a completed session
    ]
)
+ Completed ([
    {
        id: string,
        sessionId: string | undefined,
        lastModified: string
        list: [
            {
                work: number,
                break: number,
                date: string
            }
        ]
    }
])
+ User (
    id: string,
    name: string
)