// pages/api/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Here you would typically check the user credentials against your database
        console.log('User logged in:', { email, password });

        // Respond with success
        res.status(200).json({ message: 'User logged in successfully' });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}