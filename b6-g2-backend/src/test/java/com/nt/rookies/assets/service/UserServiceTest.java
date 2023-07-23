package com.nt.rookies.assets.service;

import com.nt.rookies.assets.dto.UserDto;
import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.exception.BusinessException;
import com.nt.rookies.assets.mapper.UserMapper;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    @InjectMocks
    private UserService userService = new UserServiceImpl();

    private static User user;

    // password = 12345678
    private static String oldEncodedPwd = "$2a$10$VcdzH8Q.o4KEo6df.XesdOmXdXQwT5ugNQvu1Pl0390rmfOeA1bhS";
    // password = "12348765"
    private static String newEncodedPwd = "$2a$10$QtxS5CfFaKgCuNoauqIJO./Vanlq0mBFwtv79PIdKxja.AVapyY22";

    @BeforeAll
    public static void setUp() {
        user = new User("duongnt", oldEncodedPwd, "ADMIN");
    }
    @Test
    public void shouldChangePassword() {
        String password = "12348765";
        String oldPassword = "12345678";
        String username = "duongnt";
        User userWithNewPw = new User(username, newEncodedPwd, "ADMIN", true);

        Mockito.lenient().when(userRepository.findByUsername("duongnt")).thenReturn(Optional.of(user));
        Mockito.lenient().when(userRepository.save(user)).thenReturn(userWithNewPw);
        Mockito.lenient().when(userService.changePassword(password, oldPassword)).thenReturn(UserMapper.toDto(userWithNewPw));

        UserDto userToTest = userService.changePassword(password, oldPassword);

        // isFirstTimeLogin
        assertEquals(userService.changePassword(password, null), newEncodedPwd);
        assertEquals(userToTest.getPassword(), newEncodedPwd);
        assertThat(userToTest.getPassword()).isNotEqualTo(oldEncodedPwd);
    }

    @Test
    public void shouldNotChangePasswordThenThrowError() {
        String password = "12348765";
        String oldPassword = "12345678";
        String username = "duongnt";
        User userWithNewPw = new User(username, newEncodedPwd, "ADMIN", true);

        Mockito.lenient().when(userRepository.findByUsername("duongnt")).thenReturn(Optional.of(user));
        Mockito.lenient().when(userRepository.save(user)).thenReturn(userWithNewPw);
        // input to the same password in db
        Throwable exception = assertThrows(BusinessException.class, () -> {throw new BusinessException("Please change your password.");});
        Mockito.lenient().when(userService.changePassword(password, oldPassword)).thenReturn(UserMapper.toDto(userWithNewPw));

        UserDto userToTest = userService.changePassword(oldPassword, oldPassword);

        assertEquals(userService.changePassword(oldPassword, oldPassword), exception.getMessage());
        assertEquals(userService.changePassword(password, password), exception.getMessage());
    }
}
