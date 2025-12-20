const supabase = require('./db');

async function testDoctor() {
    try {
        console.log("Testing Doctor Insert...");
        const randomEmail = `doc_${Date.now()}@example.com`;

        // 1. Insert User
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([{
                name: 'Test Doc',
                email: randomEmail,
                password_hash: 'hash',
                role: 'doctor',
                phone: '555'
            }])
            .select()
            .single();

        if (userError) throw userError;
        console.log("User Created:", user.id);

        // 2. Insert Doctor
        const { data: doc, error: docError } = await supabase
            .from('doctors')
            .insert([{
                user_id: user.id,
                department: 'General Medicine',
                specialty: 'MD'
            }])
            .select() // Add select to see result
            .single();

        if (docError) throw docError;
        console.log("Doctor Created:", doc);

    } catch (e) {
        console.error("FAIL:", e);
    }
}

testDoctor();
