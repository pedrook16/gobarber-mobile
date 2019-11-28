import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';

import { Container, Title, List } from './styles';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadAppointment() {
      const response = await api.get('appointments');
      setData(response.data);
    }
    loadAppointment();
  }, []);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);

    setData(
      data.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              canceled_at: response.data.canceled_at,
            }
          : appointment
      )
    );
  }
  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>
        <List
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Appointment OnCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="event" size={20} color={tintColor} />
  ),
};
