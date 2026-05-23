import SocietyPage from '../components/SocietyPage';

export default function Panacea() {
  return (
    <SocietyPage
      societyName="Panacea"
      logoSource={require('@/assets/images/panacea_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Welcome to Panacea, the English Literary Society of Indian Institute of Technology Bhubaneswar. We are the student media body of our esteemed institute. We cover all the happenings around the campus, take interviews, share our perspective about events across the planet, etc. We always have something to say. But that is not to say we are mundane. We are book addicts, movie buffs, novel junk-heads, TV series enthusiasts, enigmatic philosophers, audacious neophiliacs, eloquent speakers and of course, fun-lovers. Panacea is the platform where students of common interests and talents meet. This society was formed with a dual objective of honing the literary skills of the students and having fun while at it. We aim to bring together all the writers, poets, orators, debaters and the best minds of the College. We strive to organise many literary events and encourage participation among the students in order to voice their underlying views, give shape to their ideas as well as nurture and improve their creative skills."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
