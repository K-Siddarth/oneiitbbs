import SocietyPage from '../components/SocietyPage';

export default function Aaroh() {
  return (
    <SocietyPage
      societyName="Aaroh"
      logoSource={require('@/assets/images/aaroh_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Aaroh, the Music Society of IIT Bhubaneswar aims to bring out the musical talent among the students. What sets us IITians apart from the rest is our all round development, and Aaroh contributes to this by shaping students into talented performers with their own unique identities. Not only does the society conduct various events and workshops on musical instruments for amateurs, it also takes on the responsibility of organizing a production each semester to entertain and enthral the students."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
