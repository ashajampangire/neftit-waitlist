import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  wallet_address: string | null;
  referral_code: string;
  referred_by_code: string | null;
  twitter_followed: boolean;
  discord_joined: boolean;
  email_connected: boolean;
  created_at: string;
  updated_at: string;
}

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const verifyWalletAddress = (address: string) => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  const verifyTwitterFollow = async () => {
    try {
      // In a real implementation, you would use Twitter's API
      // For now, we'll simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  };

  const verifyDiscordJoin = async () => {
    try {
      // In a real implementation, you would use Discord's API
      // For now, we'll simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  };

  const joinWaitlist = async (email: string, walletAddress: string, name?: string, referredByCode?: string) => {
    setLoading(true);
    try {
      if (!verifyWalletAddress(walletAddress)) {
        toast({
          title: "Invalid wallet address",
          description: "Please enter a valid Ethereum wallet address.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert([
          {
            email,
            wallet_address: walletAddress,
            name: name || null,
            referred_by_code: referredByCode || null,
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already signed up!",
            description: "This email or wallet address is already on the waitlist.",
          });
          return null;
        }
        throw error;
      }

      if (referredByCode && data) {
        const { data: referrer } = await supabase
          .from('waitlist_entries')
          .select('email')
          .eq('referral_code', referredByCode)
          .single();

        if (referrer) {
          await supabase
            .from('referrals')
            .insert([
              {
                referrer_email: referrer.email,
                referred_email: data.email,
              }
            ]);
        }
      }

      toast({
        title: "Welcome to the waitlist!",
        description: "You've successfully joined the NEFTIT waitlist.",
      });

      return data;
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateWaitlistEntry = async (email: string, updates: Partial<WaitlistEntry>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .update(updates)
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating waitlist entry:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyAndUpdateSocials = async (email: string) => {
    try {
      const twitterFollowed = await verifyTwitterFollow();
      const discordJoined = await verifyDiscordJoin();

      const updates = {
        twitter_followed: twitterFollowed,
        discord_joined: discordJoined,
      };

      const updated = await updateWaitlistEntry(email, updates);
      return updated;
    } catch (error) {
      console.error('Error verifying socials:', error);
      return null;
    }
  };

  const getWaitlistEntry = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting waitlist entry:', error);
      return null;
    }
  };

  const getLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc('get_referral_leaderboard');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  };

  const getTotalWaitlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from('waitlist_entries')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting waitlist count:', error);
      return 0;
    }
  };

  return {
    joinWaitlist,
    updateWaitlistEntry,
    verifyAndUpdateSocials,
    getWaitlistEntry,
    getLeaderboard,
    getTotalWaitlistCount,
    loading,
  };
};