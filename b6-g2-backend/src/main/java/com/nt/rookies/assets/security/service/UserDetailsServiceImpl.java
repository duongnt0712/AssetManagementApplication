package com.nt.rookies.assets.security.service;

import com.nt.rookies.assets.entity.User;
import com.nt.rookies.assets.exception.BusinessException;
import com.nt.rookies.assets.repository.UserRepository;
import com.nt.rookies.assets.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username is incorrect. Please try again."));
        if (user.getStatus()!= null && !user.getStatus()) {
            throw new UsernameNotFoundException("Username is incorrect. Please try again.");
        }
        return UserDetailsImpl.build(user);
    }
}