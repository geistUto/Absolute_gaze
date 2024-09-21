// pages/api/signup.js
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Here you would typically save the user to your database
        console.log('User signed up:', { email, password });

        // Respond with success
        res.status(200).json({ message: 'User signed up successfully' });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}